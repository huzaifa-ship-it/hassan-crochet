"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import * as fabric from "fabric";

export interface CustomizationCanvasRef {
    addText: (text: string, font: string, color: string) => void;
    addIcon: (url: string) => void;
    download: () => void;
    updateBaseImage: (url: string) => void;
}

interface CustomizationCanvasProps {
    initialImage: string;
}

// SVG Trash icon encoded as data URL for the delete control - Red version
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const CustomizationCanvas = forwardRef<CustomizationCanvasRef, CustomizationCanvasProps>(
    ({ initialImage }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

        // Initialize Fabric Canvas
        useEffect(() => {
            if (!canvasRef.current || !containerRef.current) return;

            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Custom control colors - dark blue for visibility on all backgrounds
            const selectionColor = "#1e40af"; // Dark blue (blue-800)
            const cornerStrokeColor = "#1e3a8a"; // Darker blue (blue-900)
            const cornerColor = "#ffffff"; // White fill for corners
            const borderColor = "#1e40af"; // Dark blue border

            const canvas = new fabric.Canvas(canvasRef.current, {
                width,
                height,
                backgroundColor: "#f3f4f6",
                preserveObjectStacking: true, // Keep selected objects at their respective stack position
                selection: true,
                // Selection box styling
                selectionColor: "rgba(30, 64, 175, 0.9)", // Transparent dark blue for selection box
                selectionBorderColor: borderColor,
            });

            // Set default control colors for all objects
            fabric.Object.prototype.set({
                transparentCorners: false,
                cornerColor: "#1e40af", // Dark blue for corners
                cornerStrokeColor: "#1e3a8a", // Darker blue border for corners
                borderColor: "#1e40af", // Dark blue border
                cornerSize: 10,
                padding: 5,
                cornerStrokeWidth: 2,
                borderDashArray: [4, 4],
            });

            // Ensure canvas doesn't overflow container
            if (canvasRef.current) {
                canvasRef.current.style.maxWidth = "100%";
                canvasRef.current.style.maxHeight = "100%";
            }

            setFabricCanvas(canvas);

            // Create Delete Control globally for objects
            const img = document.createElement("img");
            img.src = deleteIcon;

            const renderIcon = function (
                this: fabric.Control,
                ctx: CanvasRenderingContext2D,
                left: number,
                top: number,
                styleOverride: any,
                fabricObject: fabric.Object
            ) {
                const size = 24;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
                ctx.restore();
            };

            const deleteObject = function (eventData: any, transform: fabric.Transform) {
                const target = transform.target;
                const canvas = target.canvas;
                if (canvas) {
                    canvas.remove(target);
                    canvas.requestRenderAll();
                }
                return true;
            };

            const customDeleteControl = new fabric.Control({
                x: 0.5,
                y: -0.5,
                offsetY: 16,
                cursorStyle: 'pointer',
                mouseUpHandler: deleteObject,
                render: renderIcon
            });

            // Automatically add the delete control to any object added to the canvas
            canvas.on('object:added', (e: any) => {
                if (e.target) {
                    if (!e.target.controls) {
                        e.target.controls = {};
                    }
                    e.target.controls.deleteControl = customDeleteControl;
                }
            });

            // Cleanup
            return () => {
                canvas.dispose();
            };
        }, []);

        // Load initial background image
        useEffect(() => {
            if (!fabricCanvas || !initialImage) return;

            const loadBaseImage = async () => {
                try {
                    // Clear any existing background
                    if (fabricCanvas.backgroundImage) {
                        fabricCanvas.backgroundImage = undefined;
                    }

                    const img = await fabric.FabricImage.fromURL(initialImage, { crossOrigin: "anonymous" });

                    // Scale to fit canvas
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    );

                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: "center",
                        originY: "center",
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                    });

                    fabricCanvas.backgroundImage = img;
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load base image:", error);
                }
            };

            loadBaseImage();
        }, [fabricCanvas, initialImage]);

        // Handle Resize
        useEffect(() => {
            if (!fabricCanvas || !containerRef.current) return;

            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    fabricCanvas.setDimensions({ width, height });

                    // Re-center background image if it exists
                    if (fabricCanvas.backgroundImage) {
                        const bg = fabricCanvas.backgroundImage as fabric.FabricImage;
                        const scale = Math.min(width / bg.width!, height / bg.height!);
                        bg.set({
                            scaleX: scale,
                            scaleY: scale,
                            left: width / 2,
                            top: height / 2,
                        });
                    }
                    fabricCanvas.requestRenderAll();
                }
            });

            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }, [fabricCanvas]);

        // Handle drops from outside (e.g. icons list)
        useEffect(() => {
            if (!fabricCanvas || !containerRef.current) return;

            const container = containerRef.current;

            const handleDragOver = (e: DragEvent) => {
                e.preventDefault(); // Necessary to allow dropping
            };

            const handleDrop = async (e: DragEvent) => {
                e.preventDefault();
                const url = e.dataTransfer?.getData("text/plain");
                if (!url) return;

                // Calculate drop position relative to canvas
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    img.set({
                        left: x,
                        top: y,
                        originX: "center",
                        originY: "center"
                    });
                    img.scaleToWidth(80); // Default icon size
                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load dropped image:", error);
                }
            };

            container.addEventListener("dragover", handleDragOver);
            container.addEventListener("drop", handleDrop);

            return () => {
                container.removeEventListener("dragover", handleDragOver);
                container.removeEventListener("drop", handleDrop);
            };
        }, [fabricCanvas]);

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            addText: (text, font, color) => {
                if (!fabricCanvas) return;

                // Color palettes for multicolor options
                const colorPalettes: Record<string, string[]> = {
                    rainbow: [
                        "#FF0000",    // Red
                        "#FF7F00",    // Orange
                        "#FFFF00",    // Yellow
                        "#00FF00",    // Green
                        "#0000FF",    // Blue
                        "#4B0082",    // Indigo
                        "#9400D3",    // Violet
                    ],
                    blossom: [
                        "#FFB6C1",    // Light Pink
                        "#FF69B4",    // Hot Pink
                        "#FF1493",    // Deep Pink
                        "#C71585",    // Medium Violet Red
                        "#FF6B6B",    // Coral Red
                        "#FFA07A",    // Light Salmon
                        "#FF007F",    // Rose
                    ],
                    cloudy: [
                        "#D3D3D3",    // Light Gray
                        "#C0C0C0",    // Silver
                        "#F5F5F5",    // White Smoke
                        "#ADD8E6",    // Light Blue
                        "#B0C4DE",    // Light Steel Blue
                        "#778899",    // Light Slate Gray
                        "#A9A9A9",    // Dark Gray
                    ],
                    grassland: [
                        "#4CAF50",    // Green
                        "#7CFC00",    // Lawn Green
                        "#228B22",    // Forest Green
                        "#808000",    // Olive
                        "#20B2AA",    // Light Sea Green
                        "#006400",    // Dark Green
                        "#32CD32",    // Lime Green
                    ],
                };

                // Check if color is a palette
                const paletteColors = colorPalettes[color];

                if (paletteColors) {
                    // For multicolor, create grouped text
                    const chars = text.split("");
                    const fontSize = 32;
                    const letterSpacing = 4;

                    // Create text objects for each character
                    const textObjects: fabric.Text[] = [];
                    let currentX = 0;

                    chars.forEach((char, index) => {
                        const colorIndex = index % paletteColors.length;
                        const charColor = paletteColors[colorIndex];

                        const charObj = new fabric.Text(char, {
                            left: currentX,
                            top: 0,
                            fontSize: fontSize,
                            fontFamily: font,
                            fill: charColor,
                            originX: "left",
                            originY: "top",
                        });

                        textObjects.push(charObj);
                        currentX += charObj.width! + letterSpacing;
                    });

                    // Create group from text objects
                    const group = new fabric.Group(textObjects, {
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                    });

                    fabricCanvas.add(group);
                    fabricCanvas.setActiveObject(group);
                    fabricCanvas.requestRenderAll();
                } else {
                    // Single color text
                    const textObj = new fabric.Textbox(text, {
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                        fontSize: 32,
                        fontFamily: font,
                        fill: color,
                        width: 200,
                        textAlign: "center",
                    });
                    fabricCanvas.add(textObj);
                    fabricCanvas.setActiveObject(textObj);
                    fabricCanvas.requestRenderAll();
                }
            },
            addIcon: async (url) => {
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    img.set({
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                    });
                    img.scaleToWidth(80);
                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load icon:", error);
                }
            },
            download: () => {
                if (!fabricCanvas) return;
                // Deselect objects to avoid bounding boxes in export
                fabricCanvas.discardActiveObject();
                fabricCanvas.requestRenderAll();

                const dataUrl = fabricCanvas.toDataURL({
                    format: "png",
                    quality: 1,
                    multiplier: 2 // High res export
                });

                const link = document.createElement("a");
                link.download = "customized-tray-table.png";
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            updateBaseImage: async (url) => {
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    );

                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: "center",
                        originY: "center",
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                    });

                    fabricCanvas.backgroundImage = img;
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to update base image:", error);
                }
            }
        }));

        return (
            <div
                ref={containerRef}
                className="w-full h-full relative overflow-hidden"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }}
                />
            </div>
        );
    }
);

CustomizationCanvas.displayName = "CustomizationCanvas";

export default CustomizationCanvas;

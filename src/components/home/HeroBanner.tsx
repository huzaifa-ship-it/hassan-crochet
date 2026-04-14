'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const HeroBanner = () => {
    return (
        <div className="w-full h-screen">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide><img src="/banner2.png" className="w-full h-full object-cover object-[50%_-200px]  " alt="" /></SwiperSlide>
                <SwiperSlide><img src="/banner1.png" className="w-full h-full object-cover" alt="" /></SwiperSlide>

            </Swiper>
        </div>
    )
}

export default HeroBanner
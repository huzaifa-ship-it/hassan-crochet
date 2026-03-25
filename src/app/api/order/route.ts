import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address, productName, productLink, customizationDetails } = body

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await sanityClient.create({
      _type: 'order',
      name,
      email,
      phone,
      address,
      productName,
      productLink,
      customizationDetails,
      status: 'new',
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, orderId: result._id }, { status: 201 })
  } catch (error) {
    console.error('Error creating order in Sanity:', error)
    return NextResponse.json(
      { message: 'Failed to create order', error: String(error) },
      { status: 500 }
    )
  }
}


import { collections, dbConnect } from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const usersCollection = await dbConnect(collections.USERS);

    const existingUser = await usersCollection.findOne({
      email: body.email,
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await usersCollection.insertOne({
      name: body.name,
      email: body.email,
      phone: body.phone,
      image: body.image,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
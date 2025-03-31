import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      const products = await prisma.products.findMany()

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new NextResponse("Something went wrong", { status: 400 });
  }
}

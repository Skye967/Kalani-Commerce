import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";
import { Context } from "vm";

export async function GET(req: NextResponse, context: Context) {

    try {
        const { id } = context.params;

        const product = await prisma.products.findFirst({
            where: {
                id: Number(id)
            }
        })

    await prisma.$disconnect();
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}

import {NextRequest, NextResponse} from 'next/server';
import {connectToDB} from '@/lib/mongoose';
import { ProviderPricingModel } from '@/models/Pricing';

export async function GET(request: NextRequest) {
    try{
        await connectToDB();
        const pricing = await ProviderPricingModel.find({});
        return NextResponse.json({message: "Connected to DB successfully", pricing}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Error connecting to DB"}, {status: 500});
    }
}
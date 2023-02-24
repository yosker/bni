import { Prop } from '@nestjs/mongoose';
import { object } from 'joi';
import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Commitments } from '../interfaces/commitments.interface';

export const EvaluationPeriodSchema = new Schema({

    chapterId: { type: Object, required: true },
    networkerId: { type: Object, required: true },
    networkerName: { type: String, required: true },
    initialPeriod: { type: String, required: true },
    finalPeriod: { type: String, required: true },
    notes: { type: String },
    commitments: { type: Array<Commitments>},
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
        required: false,
    },
    status: { type: String, default: EstatusRegister.Active, required: false },
});

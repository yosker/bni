import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const PresentationCalendarSchema = new Schema({  

    chapterId: { type: Object, required: false },
    createdBy: { type: String, required: false},
    networkerId: { type: Object, required: false },
    networkerName: { type: String, required: false},
    presentationDate: { type: String, required: false },
    comments: { type: String, required: false },
    createdAt: {
    type: String,
    default: moment().toISOString(),
    },
    status: { type: String, default: EstatusRegister.Active, required: false },
});

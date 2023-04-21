import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export const ChargesSchema = new Schema({
  chapterId: { type: Object, required: true },
  userId: { type: Object, required: true },
  concept: { type: String, required: true },
  urlFile: { type: String, required: false },
  amount: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
    required: false,
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});

import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface PresentationCalendar extends Document {
  
  chapterId: { type: object, required: false  };
  createdBy: { type: string, required: false  };
  networkerId: { type: object, required: false  };
  networkerName: { type: string, required: false  };
  presentationDate: { type: string, required: false  };
  comments: { type: string, required: false  };
  createdAt: {
    type: string;
  };
  status: { type: string; default: EstatusRegister.Active; required: false };
}

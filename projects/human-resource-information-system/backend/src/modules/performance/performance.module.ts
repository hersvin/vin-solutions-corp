import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewCycle } from '../../entities/review_cycle.entity.js';
import { EvaluationTemplate } from '../../entities/evaluation_template.entity.js';
import { RatingScale } from '../../entities/rating_scale.entity.js';
import { ReviewParticipant } from '../../entities/review_participant.entity.js';
import { Review } from '../../entities/review.entity.js';
import { ReviewResponse } from '../../entities/review_response.entity.js';
import { Goal } from '../../entities/goal.entity.js';
import { Competency } from '../../entities/competency.entity.js';
import { CalibrationSession } from '../../entities/calibration_session.entity.js';
import { PerformanceController } from './performance.controller.js';
import { CycleService } from './cycle.service.js';
import { AssessmentService } from './assessment.service.js';
import { CalibrationService } from './calibration.service.js';
import { GoalService } from './goal.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewCycle,
      EvaluationTemplate,
      RatingScale,
      ReviewParticipant,
      Review,
      ReviewResponse,
      Goal,
      Competency,
      CalibrationSession,
    ]),
  ],
  controllers: [PerformanceController],
  providers: [CycleService, AssessmentService, CalibrationService, GoalService],
  exports: [CycleService, AssessmentService, CalibrationService, GoalService],
})
export class PerformanceModule {}

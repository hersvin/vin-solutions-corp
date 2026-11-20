import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CycleService } from './cycle.service.js';
import { AssessmentService } from './assessment.service.js';
import { CalibrationService } from './calibration.service.js';
import { GoalService } from './goal.service.js';
import { RaterRole } from '../../entities/review_participant.entity.js';

@Controller('performance')
export class PerformanceController {
  constructor(
    private readonly cycleService: CycleService,
    private readonly assessmentService: AssessmentService,
    private readonly calibrationService: CalibrationService,
    private readonly goalService: GoalService,
  ) {}

  @Post('cycles')
  createCycle(
    @Body()
    body: {
      companyId: string;
      name: string;
      periodStart: string;
      periodEnd: string;
      calibrationRequired?: boolean;
      deadline?: string;
    },
  ) {
    return this.cycleService.createCycle(body);
  }

  @Get('cycles')
  listCycles(@Query('companyId') companyId?: string) {
    return this.cycleService.listCycles(companyId);
  }

  @Post('cycles/:id/activate')
  activateCycle(@Param('id') id: string) {
    return this.cycleService.activateCycle(id);
  }

  @Post('cycles/:id/finalize')
  finalizeCycle(@Param('id') id: string, @Body() body: { finalizedBy: string }) {
    return this.cycleService.finalizeCycle(id, body.finalizedBy);
  }

  @Post('cycles/:id/calibrate')
  calibrateCycle(@Param('id') id: string) {
    return this.cycleService.calibrate(id);
  }

  @Post('responses')
  submitResponse(
    @Body()
    body: {
      reviewId: string;
      participantId?: string;
      answers: Record<string, unknown>;
      comments?: string;
      evidenceRefs?: string[];
      raterRole: RaterRole;
    },
  ) {
    return this.assessmentService.submitResponse(body);
  }

  @Get('participants/:reviewCycleId/reviews')
  getParticipantReviews(
    @Param('reviewCycleId') reviewCycleId: string,
    @Query('employeeId') employeeId: string,
  ) {
    return this.assessmentService.getParticipantReviews(reviewCycleId, employeeId);
  }

  @Post('sessions')
  createSession(
    @Body()
    body: {
      reviewCycleId: string;
      heldAt: string;
      participants: string[];
    },
  ) {
    return this.calibrationService.createSession(body);
  }

  @Post('sessions/:id/outcomes')
  recordOutcomes(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.calibrationService.recordOutcomes(id, body);
  }

  @Post('goals')
  createGoal(
    @Body()
    body: {
      employeeId: string;
      reviewId?: string;
      title: string;
      targetDate?: string;
      milestones?: Record<string, unknown>;
    },
  ) {
    return this.goalService.createGoal(body);
  }

  @Patch('goals/:id/progress')
  updateProgress(@Param('id') id: string, @Body() body: { progressPct: number }) {
    return this.goalService.updateProgress(id, body.progressPct);
  }

  @Get('goals')
  listGoals(@Query('employeeId') employeeId: string) {
    return this.goalService.listGoals(employeeId);
  }
}

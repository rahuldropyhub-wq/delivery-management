import React from 'react';
import ProgressCard from '../common/ProgressCard';
import { currentMilestone } from '../../data/milestones';

export default function NextMilestoneCard({ milestone = currentMilestone, className = "" }) {
  return (
    <ProgressCard
      title="NEXT MILESTONE"
      targetName={milestone.title}
      target={milestone.targetOrders}
      current={milestone.completedOrders}
      unit="Orders"
      percentage={milestone.percentage}
      remaining={milestone.remainingOrders}
      reward={milestone.reward}
      linkTo="/app/milestones"
      className={className}
    />
  );
}

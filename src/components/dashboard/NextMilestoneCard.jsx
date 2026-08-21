import React from 'react';
import ProgressCard from '../common/ProgressCard';
import { useData } from '../../context/DataContext';

export default function NextMilestoneCard({ milestone, className = "" }) {
  const { data } = useData();
  const activeMilestone = milestone || data.milestone;

  return (
    <ProgressCard
      title="NEXT MILESTONE"
      targetName={activeMilestone.title}
      target={activeMilestone.targetOrders}
      current={activeMilestone.completedOrders}
      unit="Orders"
      percentage={activeMilestone.percentage}
      remaining={activeMilestone.remainingOrders}
      reward={activeMilestone.reward}
      linkTo="/app/milestones"
      className={className}
    />
  );
}

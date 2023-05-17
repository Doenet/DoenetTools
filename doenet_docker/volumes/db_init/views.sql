create or replace view assignment_detail as
		SELECT cc.type,
		cc.doenetId,
		cc.parentDoenetId,
		cc.label,
		cc.creationDate,
		cc.isAssigned,
		cc.isGloballyAssigned,
		cc.isPublic,
		cc.userCanViewSource,
		cc.courseId,
		CAST(cc.jsonDefinition as CHAR) AS json,
		a.assignedDate,
		a.dueDate,
		a.pinnedAfterDate,
		a.pinnedUntilDate,
		a.timeLimit,
		a.numberOfAttemptsAllowed,
		a.attemptAggregation,
		a.totalPointsOrPercent,
		a.gradeCategory,
		coalesce(a.individualize, 0) as individualize,
		a.showSolution,
		a.showSolutionInGradebook,
		a.showFeedback,
		a.showHints,
		a.showCorrectness,
		a.showCreditAchievedMenu,
		a.paginate,
		coalesce(a.showFinishButton, 0) as showFinishButton,
		coalesce(a.proctorMakesAvailable, 0) as proctorMakesAvailable,
		coalesce(a.autoSubmit, 0) as autoSubmit,
		a.canViewAfterCompleted
		FROM course_content AS cc
		LEFT JOIN assignment AS a
		ON a.doenetId = cc.doenetId
		WHERE cc.isDeleted = '0'
		ORDER BY cc.sortOrder;

create or replace view assigned_assignment_detail as 
    select ad.*, 
		coalesce(ua.completed, 0) as completed,
		ua.completedDate
    from assignment_detail ad
	LEFT JOIN user_assignment AS ua
		ON ad.doenetId = ua.doenetId
		WHERE ad.isAssigned=1
		AND (ad.type = 'activity' OR ad.type = 'section')
		AND (ua.isUnassigned = 0 OR ad.isGloballyAssigned = 1);
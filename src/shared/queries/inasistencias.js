db.users.aggregate([
  {
    $lookup: {
      from: 'attendances',
      localField: '_id',
      foreignField: 'userId',
      as: 'attendancesData',
    },
  },
  {
    $unwind: {
      path: '$attendancesData',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'chaptersessions',
      localField: 'attendancesData.chapterId',
      foreignField: 'chapterId',
      as: 'chapterSessionsData',
    },
  },
  {
    $unwind: {
      path: '$chapterSessionsData',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 1,
      count: '$chapterSessionsData.count',
      chapterId: '$attendances.DatachapterId',
      userId: '$attendancesData.userId',
      attendanceType: '$attendancesData.attendanceType',
      createdAt: '$attendancesData.createdAt',
      status: '$attendancesData.status',
      sessionDate: '$chapterSessionsData.sessionDate',
      sessionStatus: '$chapterSessionsData.status',
      email: '$email',
      name: '$name',
      userStatus: '$status',
      role: '$role',
      lastName: '$lastName',
      phoneNumber: '$phoneNumber',
      imageUrl: '$imageUrl',
      companyName: '$companyName',
      profession: '$profession',
      completedApplication: '$completedApplication',
      completedInterview: '$completedInterview',
      invitedBy: '$invitedBy',
    },
  },
]);

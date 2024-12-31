/**
 * Return the base select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item.
 */
export function returnContentStructureBaseSelect({
  includeIsAssigned = false,
  includeClassInfo = false,
}: {
  includeIsAssigned?: boolean;
  includeClassInfo?: boolean;
}) {
  return {
    id: true,
    name: true,
    ownerId: true,
    imagePath: true,
    isFolder: true,
    isPublic: true,
    isAssigned: includeIsAssigned,
    classCode: includeClassInfo,
    codeValidUntil: includeClassInfo,
    isQuestion: true,
    isInteractive: true,
    containsVideo: true,
    sharedWith: {
      select: {
        userId: true,
      },
    },
    license: {
      include: {
        composedOf: {
          select: { composedOf: true },
          orderBy: { composedOf: { sortIndex: "asc" as const } },
        },
      },
    },
    documents: {
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        source: true,
        doenetmlVersion: true,
      },
      orderBy: { id: "asc" as const },
    },
    parentFolder: {
      select: {
        id: true,
        name: true,
        isPublic: true,
        sharedWith: {
          select: {
            userId: true,
          },
        },
      },
    },
    classifications: {
      select: {
        classification: {
          select: {
            id: true,
            code: true,
            descriptions: {
              select: {
                description: true,
                subCategory: {
                  select: {
                    id: true,
                    subCategory: true,
                    sortIndex: true,
                    category: {
                      select: {
                        id: true,
                        category: true,
                        system: {
                          select: {
                            id: true,
                            name: true,
                            shortName: true,
                            categoryLabel: true,
                            subCategoryLabel: true,
                            descriptionLabel: true,
                            categoriesInDescription: true,
                            type: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where each item has full information about the owner
 */
export function returnContentStructureFullOwnerSelect() {
  const selectBase = returnContentStructureBaseSelect({});

  const selectFullOwner = {
    ...selectBase,
    owner: {
      select: {
        userId: true,
        email: true,
        firstNames: true,
        lastNames: true,
      },
    },
  };
  return selectFullOwner;
}

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where each item has full information about the users to whom the content is shared
 */
export function returnContentStructureSharedDetailsSelect({
  includeIsAssigned = false,
  includeClassInfo = false,
}: {
  includeIsAssigned?: boolean;
  includeClassInfo?: boolean;
} = {}) {
  const selectBase = returnContentStructureBaseSelect({
    includeIsAssigned,
    includeClassInfo,
  });

  const sharedWith = {
    select: {
      user: {
        select: {
          userId: true,
          email: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  };

  const parentFolderSelect = {
    ...selectBase.parentFolder.select,
    sharedWith,
  };
  const parentFolder = {
    ...selectBase.parentFolder,
    select: parentFolderSelect,
  };

  const selectedSharedDetails = {
    ...selectBase,
    sharedWith,
    parentFolder,
  };

  return selectedSharedDetails;
}

// export function returnContentStructureSelect({
//   includeSharedWithDetails = false,
//   includeIsAssigned = false,
//   doenetMLFromAssignedVersion = false,
//   countAssignmentScores = false,
// }: {
//   includeSharedWithDetails?: boolean;
//   includeIsAssigned?: boolean;
//   doenetMLFromAssignedVersion?: boolean;
//   countAssignmentScores?: boolean;
// }) {
//   const sharedWith = includeSharedWithDetails
//     ? {
//         select: {
//           user: {
//             select: {
//               userId: true,
//               email: true,
//               firstNames: true,
//               lastNames: true,
//             },
//           },
//         },
//       }
//     : {
//         select: {
//           userId: true,
//         },
//       };

//   const documentSelect = doenetMLFromAssignedVersion
//     ? {
//         id: true,
//         name: true,
//         assignedVersion: {
//           select: {
//             versionNum: true,
//             source: true,
//             doenetmlVersion: true,
//           },
//         },
//       }
//     : {
//         id: true,
//         name: true,
//         source: true,
//         doenetmlVersion: true,
//       };

//   const assignmentScores_count = countAssignmentScores
//     ? { select: { assignmentScores: true } }
//     : undefined;

//   return {
//     id: true,
//     name: true,
//     ownerId: true,
//     imagePath: true,
//     isFolder: true,
//     isPublic: true,
//     isAssigned: includeIsAssigned,
//     classCode: includeIsAssigned,
//     codeValidUntil: includeIsAssigned,
//     isQuestion: true,
//     isInteractive: true,
//     containsVideo: true,
//     sharedWith,
//     license: {
//       include: {
//         composedOf: {
//           select: { composedOf: true },
//           orderBy: { composedOf: { sortIndex: "asc" as const } },
//         },
//       },
//     },
//     documents: {
//       where: { isDeleted: false },
//       select: documentSelect,
//       orderBy: { id: "asc" as const },
//     },
//     parentFolder: {
//       select: {
//         id: true,
//         name: true,
//         isPublic: true,
//         sharedWith,
//       },
//     },
//     classifications: {
//       select: {
//         classification: {
//           select: {
//             id: true,
//             code: true,
//             descriptions: {
//               select: {
//                 description: true,
//                 subCategory: {
//                   select: {
//                     id: true,
//                     subCategory: true,
//                     sortIndex: true,
//                     category: {
//                       select: {
//                         id: true,
//                         category: true,
//                         system: {
//                           select: {
//                             id: true,
//                             name: true,
//                             shortName: true,
//                             categoryLabel: true,
//                             subCategoryLabel: true,
//                             descriptionLabel: true,
//                             categoriesInDescription: true,
//                             type: true,
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     _count: assignmentScores_count,
//   };
// }

export const initialData = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design new landing page",
        description: "Create mockups for the new product landing page",
        priority: "high",
        assignee: {
          name: "Sarah Chen",
          avatar: "/diverse-woman-avatar.png",
          initials: "SC",
        },
        dueDate: "Dec 15",
        comments: 3,
      },
      {
        id: "2",
        title: "Update documentation",
        description: "Add API documentation for new endpoints",
        priority: "medium",
        assignee: {
          name: "Mike Johnson",
          avatar: "/man-avatar.png",
          initials: "MJ",
        },
        dueDate: "Dec 18",
        comments: 1,
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Implement authentication",
        description: "Add OAuth and JWT authentication",
        priority: "high",
        assignee: {
          name: "Alex Rivera",
          avatar: "/diverse-person-avatars.png",
          initials: "AR",
        },
        dueDate: "Dec 12",
        comments: 5,
      },
      {
        id: "4",
        title: "Database optimization",
        description: "Optimize queries for better performance",
        priority: "medium",
        assignee: {
          name: "Emma Wilson",
          avatar: "/woman-avatar-2.png",
          initials: "EW",
        },
        dueDate: "Dec 14",
        comments: 2,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "5",
        title: "Setup CI/CD pipeline",
        description: "Configure GitHub Actions for deployment",
        priority: "high",
        assignee: {
          name: "David Kim",
          avatar: "/man-avatar-2.png",
          initials: "DK",
        },
        dueDate: "Dec 10",
        comments: 8,
      },
      {
        id: "6",
        title: "Create component library",
        description: "Build reusable UI components",
        priority: "low",
        assignee: {
          name: "Lisa Park",
          avatar: "/woman-avatar-3.png",
          initials: "LP",
        },
        dueDate: "Dec 8",
        comments: 4,
      },
    ],
  },
];

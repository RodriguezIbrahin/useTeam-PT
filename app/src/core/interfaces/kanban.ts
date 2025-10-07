export interface BaseKanban {
  title: string;
  description?: string;
}

export interface GetKanban extends BaseKanban {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostKanban extends BaseKanban {}

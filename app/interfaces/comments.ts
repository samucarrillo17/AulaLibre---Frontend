export interface CourseComment {
  id: string;
  name: string;
  faculty: Faculty;
}

export interface Faculty{
  id: string,
  name: string
}


export interface Comments {
  id: string;
  professorName: string;
  rating: number;
  reason: string;
  isOwner?:boolean
  createdAt: Date;
  course: CourseComment;
}


export interface PaginatedComments {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  data: Comments[];
}

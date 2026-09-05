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
  description: string;
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

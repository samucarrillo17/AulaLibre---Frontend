export interface Faculty {
  id: string;
  name: string;
}


export interface Course {
  id: string;
  name: string;
  faculty: Faculty;
  commentsCount:number
}


export interface PaginatedCourses {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  data: Course[];
}

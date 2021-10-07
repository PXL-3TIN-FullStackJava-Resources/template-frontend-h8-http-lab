export class Confession{
  post: string;
  author: string;
  department: string;
  isVisible: boolean;
  likes: number;
  dislikes: number;
  id?: number;

  constructor(post: string, department: string, author: string, isVisible: boolean = false, likes: number = 0, dislikes: number = 0, id?: number){
    this.post = post;
    this.author = author;
    this.department = department;
    this.isVisible = isVisible;
    this.likes = likes;
    this.dislikes = dislikes;
    this.id = id;
  }
}

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemConfessionService implements InMemoryDbService {
  createDb() {
    let confessions = [
      { id: 1, post: "sample post 1", author: "anonymous", department: "PXL-Digital", isVisible: false, likes: 0, dislikes: 0},
      { id: 2, post: "We didn't start the fire", author: "Billy", department: "PXL-Music", isVisible: true, likes: 4, dislikes: 0},
      { id: 3, post: "Mondays still are the worst", author: "Ernest", department: "PXL-Business", isVisible: true, likes: 419, dislikes: 4},
      { id: 4, post: "Am i an artist yet", author: "banksy", department: "PXL-MAD", isVisible: true, likes: 6, dislikes: 12}
    ];
    return {confessions};
  }
}
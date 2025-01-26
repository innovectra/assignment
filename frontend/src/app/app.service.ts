import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}
  getAllComments(): Observable<any> {
    return this.http.get('comments');
  }
  getAssignees(): Observable<any> {
    return this.http.get('assignees');
  }
  addComment(commentText: string, heading: string): Observable<any> {
    return this.http.post('comments', { commentText, heading });
  }
  likeComment(id: number): Observable<any> {
    return this.http.patch(`comments/${id}/like`, null);
  }
  addAssignee(comment: Comment, assignedTo: number): Observable<any> {
    return this.http.patch(`comments/${comment.id}/assign`, {
      assignedTo,
      comment: comment.commentText,
    });
  }
}

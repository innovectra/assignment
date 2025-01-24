import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';
import { Comment } from '../models/comment';
import { ToasterService } from './toastr.service';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  comments: Comment[] = [];
  asignees: { id: number; name: string }[] = [];
  newComment = '';
  subscriptions: Subscription[] = [];
  constructor(
    private service: AppService,
    private toastrService: ToasterService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.loaderService.show();
    this.subscriptions.push(
      this.service.getAllComments().subscribe({
        next: (res) => {
          this.toastrService.showSuccess(res.message);
          res.comments?.forEach((res: any) => {
            this.comments.push(
              new Comment(res.id, res.text, res.likes, res.assignedTo)
            );
          });
        },
        error: (err) => {
          this.toastrService.showError(err.message);
        },
      })
    );
    this.subscriptions.push(
      this.service.getAssignees().subscribe({
        next: (res) => {
          this.loaderService.hide();
          this.toastrService.showSuccess(res.message);
          this.asignees = res.assignees;
        },
        error: (err) => {
          this.loaderService.hide();
          this.toastrService.showError(err.message);
        },
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  toggleLike(comment: Comment): void {
    this.loaderService.show();
    this.subscriptions.push(
      this.service.likeComment(comment.id).subscribe({
        next: (res) => {
          this.loaderService.hide();
          this.toastrService.showSuccess(res.message);
          comment.likes++;
        },
        error: (err) => {
          this.loaderService.hide();
          this.toastrService.showError(err.message);
        },
      })
    );
  }

  toggleDropdown(comment: any): void {
    comment.showDropdown = !comment.showDropdown;
  }

  assignComment(comment: any, assignee: any): void {
    this.loaderService.show();
    this.subscriptions.push(
      this.service.addAssignee(comment, assignee.id).subscribe({
        next: (res) => {
          this.loaderService.hide();
          this.toastrService.showSuccess(res.message);
          comment.assignedTo = assignee.name;
          comment.showDropdown = false;
        },
        error: (err) => {
          this.loaderService.hide();
          this.toastrService.showError(err.message);
        },
      })
    );
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.loaderService.show();
      this.subscriptions.push(
        this.service.addComment(this.newComment).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toastrService.showSuccess(res.message);
            res = res.comments;
            this.comments.push(
              new Comment(res.id, res.commentText, res.likes, res.assignedTo)
            );
          },
          error: (err) => {
            this.loaderService.hide();
            this.toastrService.showError(err.message);
          },
        })
      );
      this.newComment = '';
    }
  }
}

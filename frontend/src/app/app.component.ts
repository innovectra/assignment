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
    this.comments.push(this.exampleComment());
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
  private exampleComment(): Comment {
    return {
      id: 0,
      section: 'Section1',
      text: 'Default comment text',
      commentText: `In today's fast-paced world, technology plays a crucial role in shaping how we interact, work, and live. Innovations in the tech industry have transformed nearly every aspect of society, from communication to education, business, and healthcare. With the advent of the internet, people across the globe are now more connected than ever before. Social media platforms allow individuals to share ideas, connect with others, and build communities. On the other hand, businesses have also embraced technological advancements to streamline operations and enhance customer experiences. Automation, artificial intelligence, and data analytics are just a few of the tools companies use to stay competitive in an ever-evolving market. In healthcare, technology has made significant strides, improving diagnostic capabilities, enabling telemedicine, and creating personalized treatment options. The rise of smart devices has further transformed daily life, making tasks easier and more efficient. Yet, with all the benefits technology offers, it also presents challenges. Issues such as data privacy, cybersecurity, and the digital divide continue to be pressing concerns. As society becomes increasingly dependent on technology, it is essential to address these challenges while ensuring that innovation remains inclusive and beneficial to all. While the future promises even greater advancements, it is important to consider both the potential benefits and the potential risks of new technologies. With thoughtful planning and regulation, we can navigate this technological landscape in a way that enhances our lives and preserves our values.`,
      likes: 1,
      showDropdown: false,
      assignedTo: 'John Doe',
    };
  }
}

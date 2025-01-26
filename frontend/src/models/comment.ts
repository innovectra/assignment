export class Comment {
  id: number = 0;
  section: string = 'Section';
  text: string = 'Default comment text';
  commentText: string = '';
  likes: number = 0;
  showDropdown: boolean = false;
  assignedTo: string = '';
  constructor(
    id: number,
    commentText: string,
    likes: number,
    assignedTo: string,
    heading: string
  ) {
    this.id = id;
    this.section += id;
    this.commentText = commentText;
    this.likes = likes;
    this.assignedTo = assignedTo;
    this.text = heading;
  }
}

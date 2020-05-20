interface AuthorI {
  name: string;
  styles: {
    textColor: string;
    backgroundColor: string; 
  };
  authorId: string;
  authorDate: Date;
}

interface PointI {
  author: AuthorI;
  content: string;
  shape: string;
  pointId: string;
  pointDate: Date
}

//TODO: validate that focus points are contained in the points array
interface MessageI {
  author: AuthorI;
  points?: PointI[];
  focus: PointI[];
  mainPoint: PointI;
  messageId: string;
  messageDate: Date;
}

interface AppI {
  authors: AuthorI[];
  messages: MessageI[];
}

export { AuthorI, PointI, MessageI, AppI };

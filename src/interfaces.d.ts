interface UserI {
  name: string;
  id: string;
  date: Date;
}

interface PointI {
  author: string;
  content: string;
  shape: string;
  id: string;
  date: Date
}

interface SemscreenI {
  author: string;
  points?: PointI[];
  focus: string;
  styles: {
    textColor: string;
    backgroundColor: string; 
  };
  id: string;
  date: Date;
}

interface AppI {
user: UserI;
semscreens: SemscreenI[];
}

export { UserI, PointI, SemscreenI, AppI };

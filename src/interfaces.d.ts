interface UserI {
  name: string;
  id: string;
  date: Date;
}

interface PointI {
  content: string;
  shape: string;
  id: string;
  date: Date
}

interface SemscreenI {
  username: string;
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
semscreen: SemscreenI;
}

export { UserI, PointI, SemscreenI, AppI };

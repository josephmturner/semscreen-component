//TODO: figure out 'cannot import interface as type error when you
//import AppI from interfaces and then try to use it as the interface
//for initialAppState
//TODO: import AppI from interfaces
//TODO: remove focus and add it to semscreenI, and confirm that it
//exists in the array of points contained in the semscreen
interface AppSchema {
  user: {
    name: string;
    id?: string;
    date: Date;
    hash?: string;
  };
  semscreens: {
    username: string;
    points?: {
      content: string;
      shape: string;
      id: string;
      date: Date;
      hash?: string;
    }[];
    styles: {
      textColor: string;
      backgroundColor: string;
    };
    id: string;
    date: Date;
    hash?: string;
  }[];
}

const initialAppState: AppSchema = {
  user: {
    name: 'anonymous',
    date: new Date(),
  },
  semscreens: [
    {
      username: 'anonymous',
      points: [
        {
          content: 'Online Deliberation',
          shape: 'Topics',
          id: 'point1',
          date: new Date(),
        },
        {
          content:
            'Build an open, collaborative, compassionate system to share information and make decisions.',
          shape: 'Actions',
          id: 'point2',
          date: new Date(),
        },
        {
          content:
            'Create a frontend which can ride on federated and distributed backends, such as IPFS.',
          shape: 'Actions',
          id: 'point3',
          date: new Date(),
        },
        {
          content: 'Paula Maas',
          shape: 'People',
          id: 'point4',
          date: new Date(),
        },
        {
          content: 'Alex Garcia',
          shape: 'People',
          id: 'point5',
          date: new Date(),
        },
        {
          content: 'Joseph Chambers',
          shape: 'People',
          id: 'point6',
          date: new Date(),
        },
        {
          content: 'Martin Turner',
          shape: 'People',
          id: 'point7',
          date: new Date(),
        },
        {
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
      ],
      styles: {
        textColor: '#111',
        backgroundColor: '#eee',
      },
      id: 'semscreen1',
      date: new Date(),
    },
  ],
};

export { initialAppState };

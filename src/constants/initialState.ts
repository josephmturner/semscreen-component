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
      focus: boolean;
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
          focus: true,
          id: 'point1',
          date: new Date(),
        },
        {
          content:
            'Build an open, collaborative, compassionate system to share information and make decisions.',
          shape: 'Actions',
          focus: false,
          id: 'point2',
          date: new Date(),
        },
        {
          content:
            'Create a frontend which can ride on federated and distributed backends, such as IPFS.',
          shape: 'Actions',
          focus: false,
          id: 'point3',
          date: new Date(),
        },
        {
          content: 'Paula Maas',
          shape: 'People',
          focus: false,
          id: 'point4',
          date: new Date(),
        },
        {
          content: 'Alex Garcia',
          shape: 'People',
          focus: false,
          id: 'point5',
          date: new Date(),
        },
        {
          content: 'Joseph Chambers',
          shape: 'People',
          focus: false,
          id: 'point6',
          date: new Date(),
        },
        {
          content: 'Martin Turner',
          shape: 'People',
          focus: false,
          id: 'point7',
          date: new Date(),
        },
        {
          content: 'Joseph Turner',
          shape: 'People',
          focus: false,
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

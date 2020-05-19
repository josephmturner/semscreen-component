//TODO: how to confirm that focus point exists in the array of points
//contained in the semscreen?
import {AppI} from '../interfaces';

const initialAppState: AppI = {
  user: {
    name: 'anonymous',
    date: new Date(),
    id: 'user1',
  },
  semscreens: [
    {
      author: 'anonymous',
      points: [
        {
          author: 'KindWoman',
          content: 'Online Deliberation',
          shape: 'Topics',
          id: 'point1',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content:
            'Build an open, collaborative, compassionate system to share information and make decisions.',
          shape: 'Actions',
          id: 'point2',
          date: new Date(),
        },
        {
          author: 'josephmturner',
          content:
            'Create a frontend which can ride on federated and distributed backends, such as IPFS.',
          shape: 'Actions',
          id: 'point3',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content: 'Paula Maas',
          shape: 'People',
          id: 'point4',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content: 'Alex Garcia',
          shape: 'People',
          id: 'point5',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content: 'Joseph Chambers',
          shape: 'People',
          id: 'point6',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content: 'Martin Turner',
          shape: 'People',
          id: 'point7',
          date: new Date(),
        },
        {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
          {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
           {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
           {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
         {
          author: 'KindWoman',
          content: 'Joseph Turner',
          shape: 'People',
          id: 'point8',
          date: new Date(),
        },
 ],
      focus: 'point1',
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

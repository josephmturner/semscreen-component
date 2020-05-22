//TODO: how to confirm that focus point exists in the array of points
//contained in the semscreen?
import { AuthorI, PointI, MessageI, AppI } from '../interfaces';

const authors: AuthorI[] = [
  { 
    name: 'KindWoman',
    authorDate: new Date(),
    authorId: 'user1',
    styles: {
      textColor: '#111',
      backgroundColor: '#eee',
    },
  },
]

const points: PointI[] = [
  {
    author: authors[0],
    content: 'Online Deliberation (focus)',
    shape: 'Topics',
    pointId: 'point1',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Build an open, collaborative, compassionate system to share information and make decisions (main point)',
    shape: 'Actions',
    pointId: 'point2',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Create a frontend which can ride on federated and distributed backends, such as IPFS.',
    shape: 'Actions',
    pointId: 'point1',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Build an open, collaborative, compassionate system to share information and make decisions',
    shape: 'Actions',
    pointId: 'point2',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Build an open, collaborative, compassionate system to share information and make decisions',
    shape: 'Actions',
    pointId: 'point2',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Create a frontend which can ride on federated and distributed backends, such as IPFS.',
    shape: 'Actions',
    pointId: 'point1',
    pointDate: new Date(),
  },
  {
    author: authors[0],
    content: 'Build an open, collaborative, compassionate system to share information and make decisions',
    shape: 'Actions',
    pointId: 'point2',
    pointDate: new Date(),
  },
]

const messages: MessageI[] = [
  {
    author: authors[0],
    points: points,
    focus: points.slice(0,1),
    mainPoint: points[1],
    messageId: 'semscreen1',
    messageDate: new Date(),
  },
]

export { messages };

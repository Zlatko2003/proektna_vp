const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@test.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        bio: 'Platform administrator and full-stack developer with 10+ years of experience.',
        location: 'San Francisco, CA',
        reputation: 1500,
        createdAt: new Date('2024-01-01')
    },
    {
        name: 'Regular User',
        email: 'user@test.com',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        bio: 'Passionate developer learning new technologies every day.',
        location: 'New York, NY',
        reputation: 750,
        createdAt: new Date('2024-02-15')
    },
];

const questions = [
    {
        title: 'How to use useState in React?',
        content: 'I am learning React and I want to understand how useState hook works. Can someone explain with examples? I have been struggling with state management in functional components.',
        tags: ['react', 'hooks', 'javascript'],
        views: 256,
        createdAt: new Date('2024-09-15')
    },
    {
        title: 'What is middleware in Express?',
        content: 'I see middleware being used in Express.js but I dont fully understand the concept. Can you explain what middleware is and how it works?',
        tags: ['express', 'nodejs', 'backend'],
        views: 189,
        createdAt: new Date('2024-09-20')
    },
    {
        title: 'How to connect MongoDB with Node.js?',
        content: 'I am building a Node.js application and I need to connect to MongoDB. What are the best practices and how do I set it up?',
        tags: ['mongodb', 'nodejs', 'database'],
        views: 312,
        createdAt: new Date('2024-09-25')
    },
    {
        title: 'Angular vs React: Which one to choose?',
        content: 'Im starting a new project and Im confused between Angular and React. What are the pros and cons of each?',
        tags: ['angular', 'react', 'frontend'],
        views: 423,
        createdAt: new Date('2024-09-28')
    }
];

const answers = [
    {
        content: 'useState is a Hook that lets you add React state to function components. The syntax is: const [state, setState] = useState(initialState). Here is a simple counter example: const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Click me {count}</button>',
        votes: 15,
        createdAt: new Date('2024-09-16')
    },
    {
        content: 'Middleware in Express are functions that execute during the request-response cycle. They have access to the request and response objects and can modify them. Common use cases include logging, authentication, and error handling.',
        votes: 12,
        createdAt: new Date('2024-09-21')
    },
    {
        content: 'To connect MongoDB with Node.js, use the Mongoose ODM. Install mongoose, create a connection string, and use mongoose.connect() to establish the connection. Always handle connection errors and use connection pooling.',
        votes: 8,
        createdAt: new Date('2024-09-26')
    },
    {
        content: 'Choose React if you need flexibility and a rich ecosystem. Choose Angular if you prefer a complete framework with built-in features and strong typing. Both are great choices!',
        votes: 10,
        createdAt: new Date('2024-09-29')
    },
    {
        content: 'Closures are functions that have access to variables from their outer scope even after the outer function has returned. They are created every time a function is created in JavaScript and are useful for creating private variables and function factories.',
        votes: 7,
        createdAt: new Date('2024-10-02')
    },
    {
        content: 'To deploy Node.js to AWS, use Elastic Beanstalk for simple deployment, or EC2 for more control. You can also use AWS Lambda for serverless deployment. Dont forget to set up environment variables and security groups.',
        votes: 9,
        createdAt: new Date('2024-10-06')
    },
    {
        content: 'Use CSS Grid for 2D layouts (rows and columns) and Flexbox for 1D layouts (either row or column). Grid is great for overall page structure while Flexbox is better for component-level layouts.',
        votes: 6,
        createdAt: new Date('2024-10-09')
    },
    {
        content: 'TypeScript decorators are special declarations that can be attached to classes, methods, or properties. They are used to add metadata or modify behavior. They are commonly used in Angular for dependency injection and routing.',
        votes: 5,
        createdAt: new Date('2024-10-11')
    },
    {
        content: 'REST APIs are simpler and more widely adopted. GraphQL provides more flexibility and reduces over-fetching. Choose REST for simple APIs and GraphQL for complex data requirements.',
        votes: 8,
        createdAt: new Date('2024-10-13')
    },
    {
        content: 'Store JWT tokens securely in HTTP-only cookies instead of localStorage. Use short expiration times and implement refresh tokens. Always use HTTPS and validate tokens on the server side.',
        votes: 11,
        createdAt: new Date('2024-10-16')
    },
    {
        content: 'Docker provides containerization with shared kernel resources, making it more lightweight and faster to start. Virtual Machines provide full isolation with dedicated resources but are heavier and slower.',
        votes: 6,
        createdAt: new Date('2024-10-19')
    },
    {
        content: 'Optimize React performance by using React.memo for component memoization, useMemo for expensive calculations, useCallback for function memoization, and implement virtualization for long lists. Also consider code splitting and lazy loading.',
        votes: 14,
        createdAt: new Date('2024-10-21')
    }
];

const tags = [
    { name: 'react', count: 45 },
    { name: 'angular', count: 38 },
    { name: 'nodejs', count: 52 },
    { name: 'express', count: 30 },
    { name: 'mongodb', count: 28 },
    { name: 'javascript', count: 65 },
    { name: 'typescript', count: 35 },
    { name: 'css', count: 22 },
    { name: 'html', count: 18 },
    { name: 'python', count: 15 },
    { name: 'docker', count: 20 },
    { name: 'aws', count: 18 },
    { name: 'graphql', count: 12 },
    { name: 'security', count: 16 },
    { name: 'performance', count: 14 },
    { name: 'devops', count: 22 },
    { name: 'database', count: 25 },
    { name: 'frontend', count: 40 },
    { name: 'backend', count: 35 },
    { name: 'hooks', count: 12 }
];

module.exports = { users, questions, answers, tags };
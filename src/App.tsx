import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoWithUser } from './types/TodoWithUser';
import { useState } from 'react';
import { TodoList } from './components/TodoList';

export const App = () => {
  const findOwner = (id: Todo['id']): User | undefined => {
    return usersFromServer.find(user => user.id === id);
  };

  const todoVithUsers = todosFromServer.map(todo => {
    const user = findOwner(todo.userId);

    return { ...todo, user };
  });

  const [visibleTodos, setVisibleTodos] =
    useState<TodoWithUser[]>(todoVithUsers);
  const [titleValue, setTitleValue] = useState('');
  const [userIdValue, setUserIdValue] = useState(0);
  // const [toutchedField, setTouchedField] = useState({
  //   titleInput: false,
  //   userIdInput: false,
  // });

  const createTodo = (): TodoWithUser => {
    const newId: number =
      Math.max(...visibleTodos.map((todo: TodoWithUser) => todo.id)) + 1;
    const user = findOwner(userIdValue);

    return {
      id: newId,
      title: titleValue,
      completed: false,
      userId: userIdValue,
      user,
    };
  };

  const onInputChange = (value: string | number) => {
    if (typeof value === 'string') {
      setTitleValue(value);
      // setTouchedField(prev => ({ ...prev, titleInput: false }));
    } else {
      // setTouchedField(prev => ({ ...prev, userIdInput: false }));
      setUserIdValue(value);
    }
  };

  const reset = () => {
    setTitleValue('');
    setUserIdValue(0);
    // setTouchedField({
    //   titleInput: false,
    //   userIdInput: false,
    // });
  };

  const onFormSubmit = (event: HTMLFormElement) => {
    event.preventDefault();
    if (titleValue.length < 1 || userIdValue === 0) {
      return;
    }

    const newTodo = createTodo();

    setVisibleTodos(prev => [...prev, newTodo]);
    reset();
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={e => onFormSubmit(e)}>
        <div className="field">
          <input
            type="text"
            name="title"
            data-cy="titleInput"
            placeholder="enter some text"
            value={titleValue}
            onChange={event => onInputChange(event.target.value)}
            required
            // onBlur={event =>
            //   setTouchedField(prev => ({
            //     ...prev,
            //     titleInput: true,
            //   }))
            // }
          />

          {titleValue.length < 1 && (
            <span className="error">Please enter a title</span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userIdValue}
            onChange={event => onInputChange(+event.target.value)}
            required
            // onBlur={event =>
            //   setTouchedField(prev => ({ ...prev, userIdInput: true }))
            // }
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {userIdValue <= 0 && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={visibleTodos} />
    </div>
  );
};

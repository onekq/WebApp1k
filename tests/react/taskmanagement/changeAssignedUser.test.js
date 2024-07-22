import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskApp from './changeAssignedUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Change assigned user successfully', async () => {
  fetchMock.post('/change-assigned-user', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('change-assigned-user-button')); });

  expect(fetchMock.calls('/change-assigned-user').length).toBe(1);
  expect(screen.getByText('User changed successfully')).toBeInTheDocument();
}, 10000);

test('Fail to change assigned user due to server error', async () => {
  fetchMock.post('/change-assigned-user', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('change-assigned-user-button')); });

  expect(fetchMock.calls('/change-assigned-user').length).toBe(1);
  expect(screen.getByText('Error changing user')).toBeInTheDocument();
}, 10000);


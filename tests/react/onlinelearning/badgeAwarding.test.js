import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseAchievement from './badgeAwarding';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Badge is awarded for course achievements.', async () => {
  fetchMock.post('/api/course/awardBadge', { badgeId: 1 });

  await act(async () => { render(<MemoryRouter><CourseAchievement /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/achieve badge/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/badge awarded/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when badge awarding fails.', async () => {
  fetchMock.post('/api/course/awardBadge', 500);

  await act(async () => { render(<MemoryRouter><CourseAchievement /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/achieve badge/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to award badge/i)).toBeInTheDocument();
}, 10000);


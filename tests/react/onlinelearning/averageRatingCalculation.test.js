import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseRating from './averageRatingCalculation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Average rating is calculated correctly for a course.', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><CourseRating /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails.', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><CourseRating /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);


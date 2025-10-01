import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './averageRatingCalculation_courseRecommendation_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Average rating is calculated correctly for a course.', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails.', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);

test('Successfully displays course recommendations', async () => {
  fetchMock.get('/course-recommendations', { status: 200, body: [{ id: 1, title: 'Course 1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course 1')).toBeInTheDocument();
}, 10000);

test('Fails to display course recommendations', async () => {
  fetchMock.get('/course-recommendations', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recommendations failed')).toBeInTheDocument();
}, 10000);

test('Successfully tracks order status', async () => {
  fetchMock.get('/order/status', { status: 200, body: { status: 'Shipped' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
}, 10000);

test('Fails to track order status', async () => {
  fetchMock.get('/order/status', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tracking failed')).toBeInTheDocument();
}, 10000);

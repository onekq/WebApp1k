import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editArticle_smsNotifications_suggestArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully edits existing articles', async () => {
  fetchMock.put('path/to/api/article', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to edit existing articles with error message', async () => {
  fetchMock.put('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully sends SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 200);

  await act(async () => { render(<MemoryRouter><SmsNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SMS sent')).toBeInTheDocument();
}, 10000);

test('Fails to send SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 500);

  await act(async () => { render(<MemoryRouter><SmsNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send SMS')).toBeInTheDocument();
}, 10000);

test('successfully suggests articles based on ticket content', async () => {
  fetchMock.post('path/to/api/article/suggest', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('suggested-articles-list')).toBeInTheDocument();
}, 10000);

test('fails to suggest articles based on ticket content with error message', async () => {
  fetchMock.post('path/to/api/article/suggest', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

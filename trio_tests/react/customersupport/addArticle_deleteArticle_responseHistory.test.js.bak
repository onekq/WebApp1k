import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addArticle_deleteArticle_responseHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds new articles', async () => {
  fetchMock.post('path/to/api/article', 201);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to add new articles with error message', async () => {
  fetchMock.post('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully deletes outdated articles', async () => {
  fetchMock.delete('path/to/api/article', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to delete outdated articles with error message', async () => {
  fetchMock.delete('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Tracking the history of responses should show response history.', async () => {
  fetchMock.get('/api/response-history', { history: ['Initial response', 'Follow-up response'] });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Initial response')).toBeInTheDocument();
}, 10000);

test('Tracking the history of responses should show error message when failed.', async () => {
  fetchMock.get('/api/response-history', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Failed to retrieve response history')).toBeInTheDocument();
}, 10000);

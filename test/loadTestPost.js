import http from 'k6/http';

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '10s',
      preAllocatedVUs: 500,
      maxVUs: 10000,
    },
  },
};

const getRandom = (max) => {
  return (Math.floor(Math.random() * max));
}

export default function () {
  const payload = JSON.stringify({
    title: "TEST BOOK",
    subtitle: "This is a test book.",
    author: "Testy McTesterson",
    narrator: "T. Testphalia",
    imageUrl: "www.testurl.com/image34.png",
    audioSampleUrl: "www.testurl.com/audiofile34.mp4",
    length: "42 hours 42 minutes",
    version: "Unabridged Audiobook",
    category: ["Test Category 1", "Test Category 2"]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(`http://localhost:2002/api/book/`, payload, params);
}
import Twitter from 'twitter';

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// client.post('statuses/update', { status: 'test' }).catch(console.error);

const getDate = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

// eslint-disable-next-line import/prefer-default-export
export const twitterEotd = async (submission) => {
  try {
    const res = await client.post('media/upload', { media_data: submission.image });
    await client.post('statuses/update', {
      status: `Equation of the Day ${getDate()} "${submission.title}"`,
      media_ids: res.media_id_string,
    });
  } catch (err) {
    console.error(err);
  }
};

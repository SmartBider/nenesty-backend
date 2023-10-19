/* eslint-disable @typescript-eslint/no-explicit-any */
import Parse from 'parse/node';

/* The above code is defining a Parse Cloud Function called 'reviewToFollow'. This function takes a
request object as a parameter and performs the following steps: */
Parse.Cloud.define('reviewToFollow', async (request) => {
  const { followings } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { username };
  }

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    if (currentUser) {
      const schema = await Parse.Schema.all();
      const followersClass = schema.find((s) => s.className === 'Followers');

      if (!followersClass) {
        return false;
      }
      const { username } = await getUser(followings);

      const query = new Parse.Query('Followers');
      query.containedIn('ethAddress', [ethAddress]);
      query.containedIn('followings', [{ userName: username, ethAddressFollowings: followings }]);

      const queryResult = await query.first({ useMasterKey: true });

      return queryResult ? true : false;
    }
    return false;
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud Function called "follow". This function is used to add a
user to the list of followers for another user. */
Parse.Cloud.define('follow', async (request) => {
  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { username };
  }

  try {
    const { followings } = request.params;

    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');

    if (ethAddress && ethAddress !== followings) {
      const Followers = Parse.Object.extend('Followers');
      const query = new Parse.Query(Followers);
      query.equalTo('ethAddress', ethAddress);

      const follower = await query.first();

      if (follower) {
        // Add followings to the follower's list
        const { username } = await getUser(followings);

        follower.addUnique('followings', { userName: username, ethAddressFollowings: followings });
        await follower.save();
        return 'save follow';
      }
    }
    return 'Error adding followings to follower';
  } catch (error) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
});

/* The above code is defining a Parse Cloud Function called "unFollow". This function is used to remove
a user from the list of followers of the current user. */
Parse.Cloud.define('unFollow', async (request) => {
  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { username };
  }
  try {
    const { followings } = request.params;
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');

    if (currentUser && ethAddress !== followings) {
      const Followers = Parse.Object.extend('Followers');
      const query = new Parse.Query(Followers);
      query.equalTo('ethAddress', ethAddress);

      const follower = await query.first();

      if (follower) {
        const { username } = await getUser(followings);

        const followingsToRemove = { userName: username, ethAddressFollowings: followings };
        await follower.save({ followings: { __op: 'Remove', objects: [followingsToRemove] } });
        return 'remove succes ';
      }
    }
    return 'remove failed';
  } catch (error: any) {
    return error;
  }
});

/* The above code is a TypeScript cloud function in the Parse server environment. It defines a function
called "showFollower" that takes a request object as a parameter. */
Parse.Cloud.define('showFollower', async (request) => {
  const currentUser = request.user;
  const ethAddress = currentUser?.get('ethAddress');

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getCountFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');

    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  if (currentUser) {
    const query = new Parse.Query('Followers');
    query.equalTo('ethAddress', ethAddress);

    const follower = await query.first({ useMasterKey: true });

    const followernew = follower?.get('followings');

    if (followernew) {
      const response = await Promise.all(
        followernew.map(async (value: any) => {
          const ethAddressUser = value.ethAddressFollowings;

          let newArray: any = [];
          const { username, userAvatar } = await getUser(ethAddressUser);
          const theFollower = await getCountFollowers(ethAddressUser, username);
          newArray = { theFollower, username, userAvatar, ethAddressUser };
          return newArray;
        }),
      );
      return response;
    }
    return 0;
  }
  return 0;
});

/* The above code is a Parse Cloud Code function written in TypeScript. It defines a function called
"showFollowing" that can be called remotely. */
Parse.Cloud.define('showFollowing', async (request) => {
  const currentUser = request.user;
  const ethAddress = currentUser?.get('ethAddress');

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getUserFollowings(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const usernameFollowings =
      resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { usernameFollowings };
  }

  async function getCountFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');

    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  if (ethAddress) {
    const { usernameFollowings } = await getUserFollowings(ethAddress);

    const query = new Parse.Query('Followers');
    query.containedIn('followings', [{ userName: usernameFollowings, ethAddressFollowings: ethAddress }]);

    const follower = await query.find({ useMasterKey: true });

    if (follower) {
      const response = await Promise.all(
        follower.map(async (value) => {
          const objStr = JSON.stringify(value);
          const objJson = JSON.parse(objStr);
          const ethAddressUser = objJson.ethAddress ? objJson.ethAddress : '';

          const { username, userAvatar } = await getUser(ethAddressUser);
          const theFollower = await getCountFollowers(ethAddressUser, username);

          let newArray: any = [];

          newArray = { theFollower, username, userAvatar, ethAddressUser };
          return newArray;
        }),
      );

      return response;
    }
    return 0;
  }
  return 0;
});
/* The above code is defining a Cloud Function in Parse Server called "showFollowerArtist". This
function takes a parameter called "artist" and performs the following tasks: */

Parse.Cloud.define('showFollowerArtist', async (request) => {
  const { artist } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getUserFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');
    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  const query = new Parse.Query('Followers');
  query.equalTo('ethAddress', artist);
  const follower = await query.first({ useMasterKey: true });
  const followernew = follower?.get('followings');

  if (followernew) {
    const response = await Promise.all(
      followernew.map(async (value: any) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const ethAddressUser = objJson.ethAddressFollowings ? objJson.ethAddressFollowings : '';
        const userName = objJson.userName ? objJson.userName : '';
        let newArray: any = [];
        const theFollower = await getUserFollowers(ethAddressUser, userName);
        const { username, userAvatar } = await getUser(ethAddressUser);
        newArray = { theFollower, username, userAvatar, ethAddressUser };
        return newArray;
      }),
    );
    return response;
  }
  return 0;
});

/* The above code is defining a Parse Cloud Function called "showFollowingArtist". This function takes
a parameter called "artist" and performs the following tasks: */
Parse.Cloud.define('showFollowingArtist', async (request) => {
  const { artist } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getUserArtists(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const userNameArtists = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { userNameArtists };
  }

  async function getCountFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');

    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  const { userNameArtists } = await getUserArtists(artist);

  const query = new Parse.Query('Followers');
  query.containedIn('followings', [{ userName: userNameArtists, ethAddressFollowings: artist }]);

  const follower = await query.find({ useMasterKey: true });

  if (follower) {
    const response = await Promise.all(
      follower.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const ethAddressUser = objJson.ethAddress ? objJson.ethAddress : '';

        const { username, userAvatar } = await getUser(ethAddressUser);

        const theFollower = await getCountFollowers(ethAddressUser, username);

        let newArray: any = [];

        newArray = { theFollower, username, userAvatar, ethAddressUser };
        return newArray;
      }),
    );

    return response;
  }
  return 0;
});

/* The above code is a Parse Cloud function written in TypeScript. It defines a function called
'showFollowingPerfilArtist' that takes a request object as a parameter. */
Parse.Cloud.define('showFollowingPerfilArtist', async (request) => {
  const { artist } = request.params;
  let following = 0;
  let followers = 0;

  async function getUserArtists(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const userNameArtists = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { userNameArtists };
  }

  const { userNameArtists } = await getUserArtists(artist);

  const queryFollower = new Parse.Query('Followers');
  queryFollower.containedIn('followings', [{ userName: userNameArtists, ethAddressFollowings: artist }]);

  const countFollower = await queryFollower.count({ useMasterKey: true });

  if (countFollower) {
    followers = countFollower;
  } else {
    followers = 0;
  }
  const queryFollowing = new Parse.Query('Followers');
  queryFollowing.equalTo('ethAddress', artist);

  const followingResult = await queryFollowing.first();
  if (followingResult) {
    const countFollowing = followingResult.get('followings');
    const count = countFollowing?.length ? countFollowing.length : 0;
    following = count;
  } else {
    following = 0;
  }
  let newArray: any = [];

  newArray = { following, followers };

  return newArray;
});

/* The above code is a TypeScript cloud function in Parse Server. It defines a function called
'showFollowingPerfilUser' that retrieves information about the number of followers and followings
for a user. */
Parse.Cloud.define('showFollowingPerfilUser', async (request) => {
  const currentUser = request.user;
  const ethAddress = currentUser?.get('ethAddress');

  let following = 0;
  let followers = 0;
  let newArray: any = [];

  async function getUserArtists(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const userNameArtists = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { userNameArtists };
  }
  try {
    if (ethAddress) {
      const { userNameArtists } = await getUserArtists(ethAddress);

      const queryFollower = new Parse.Query('Followers');
      queryFollower.containedIn('followings', [{ userName: userNameArtists, ethAddressFollowings: ethAddress }]);
      const countFollower = await queryFollower.count({ useMasterKey: true });

      if (countFollower) {
        followers = countFollower;
      } else {
        followers = 0;
      }
      const queryFollowing = new Parse.Query('Followers');
      queryFollowing.equalTo('ethAddress', ethAddress);

      const followingResult = await queryFollowing.first();
      if (followingResult) {
        const countFollowing = followingResult.get('followings');
        const count = countFollowing?.length ? countFollowing.length : 0;
        following = count;
      } else {
        following = 0;
      }

      newArray = { following, followers };

      return newArray;
    }

    newArray = { following, followers };
    return newArray;
  } catch (error: any) {
    return `error  ${error}`;
  }
});

/* The above code is defining a Parse Cloud Function called "FilterOptionFollower" in TypeScript. This
function takes a request object as a parameter and returns a filtered list of followers based on a
given username. */
Parse.Cloud.define('FilterOptionFollower', async (request) => {
  const { UserName } = request.params;
  const resultFilter: any = [];

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');

    if (ethAddress) {
      const query = new Parse.Query('Followers');
      query.equalTo('ethAddress', ethAddress);

      const follower = await query.first({ useMasterKey: true });
      const followernew = follower?.get('followings');
      if (followernew) {
        await Promise.all(
          followernew.map(async (element: any) => {
            if (UserName.length > 0) {
              if (element.userName.search(UserName) === 0) {
                resultFilter.push(element);
              }
            }
          }),
        );
      }
      return resultFilter;
    }
    return resultFilter;
  } catch (error) {
    return error;
  }
});
/* The above code is a Parse Cloud Function written in TypeScript. It defines a function called
"FilterOptionFollowings" that takes a request object as a parameter. */

Parse.Cloud.define('FilterOptionFollowings', async (request) => {
  const { userNameFollowings } = request.params;
  const resultFollowigs: any = [];
  const resultUsers: any = [];
  const resultFilter: any = [];

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { username };
  }

  async function getArtist(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const userNameArtists = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { userNameArtists };
  }

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    const { username } = await getUser(ethAddress);
    if (ethAddress && userNameFollowings.length > 0) {
      const query = new Parse.Query('Followers');
      query.containedIn('followings', [{ userName: username, ethAddressFollowings: ethAddress }]);
      const followingResult = await query.find({ useMasterKey: true });

      await Promise.all(
        followingResult.map(async (userEth: any) => {
          const objStr = JSON.stringify(userEth);
          const objJson = JSON.parse(objStr);
          resultFollowigs.push(objJson.ethAddress);
        }),
      );

      const queryUser = new Parse.Query('User');
      const userResult = await queryUser.find({ useMasterKey: true });

      await Promise.all(
        userResult.map(async (value: any) => {
          const objStr = JSON.stringify(value);
          const objJson = JSON.parse(objStr);
          if (objJson.username.startsWith(userNameFollowings)) {
            resultUsers.push(objJson.ethAddress);
          }
        }),
      );

      await Promise.all(
        resultUsers.map(async (element: any) => {
          const objStr = JSON.stringify(element);
          const objJson = JSON.parse(objStr);
          if (resultFollowigs.includes(objJson)) {
            const { userNameArtists } = await getArtist(objJson);
            resultFilter.push({ userName: userNameArtists, ethAddressFollowings: element });
          }
        }),
      );

      return resultFilter;
    }
    return resultFilter;
  } catch (error) {
    return error;
  }
});

/* The above code is a Parse Cloud Code function written in TypeScript. It defines a cloud function
called "ToGoFilterOptionFollower". */
Parse.Cloud.define('ToGoFilterOptionFollower', async (request) => {
  const { ethAddressUser, userNameFollowers } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getCountFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');

    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  try {
    const currentUser = request.user;
    await currentUser?.fetch();
    const ethAddress = currentUser?.get('ethAddress');

    if (ethAddress) {
      const query = new Parse.Query('Followers');
      query.equalTo('ethAddress', ethAddressUser);
      const follower = await query.find({ useMasterKey: true });
      if (follower) {
        const { username, userAvatar } = await getUser(ethAddressUser);

        const theFollower = await getCountFollowers(ethAddressUser, userNameFollowers);

        const newArray: any = [{ theFollower, username, userAvatar, ethAddressUser }];

        return newArray;
      }
    }
    return false;
  } catch (error) {
    return error;
  }
});

/* The above code is a Parse Cloud Function written in TypeScript. It defines a function called
"FilterOptionFollowingsArtist" that takes in two parameters: "userNameSearch" and "artist". */
Parse.Cloud.define('FilterOptionFollowingsArtist', async (request) => {
  const { userNameSearch, artist } = request.params;

  const resultFollowigs: any = [];
  const resultUsers: any = [];
  const resultFilter: any = [];

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { username };
  }

  async function getArtist(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const userNameArtists = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';

    return { userNameArtists };
  }

  try {
    if (userNameSearch.length > 0) {
      const { username } = await getUser(artist);
      const query = new Parse.Query('Followers');
      query.containedIn('followings', [{ userName: username, ethAddressFollowings: artist }]);
      const followingResult = await query.find({ useMasterKey: true });

      await Promise.all(
        followingResult.map(async (userEth: any) => {
          const objStr = JSON.stringify(userEth);
          const objJson = JSON.parse(objStr);
          resultFollowigs.push(objJson.ethAddress);
        }),
      );

      const queryUser = new Parse.Query('User');
      const userResult = await queryUser.find({ useMasterKey: true });

      await Promise.all(
        userResult.map(async (value: any) => {
          const objStr = JSON.stringify(value);
          const objJson = JSON.parse(objStr);
          if (objJson.username.startsWith(userNameSearch)) {
            resultUsers.push(objJson.ethAddress);
          }
        }),
      );

      await Promise.all(
        resultUsers.map(async (element: any) => {
          const objStr = JSON.stringify(element);
          const objJson = JSON.parse(objStr);
          if (resultFollowigs.includes(objJson)) {
            const { userNameArtists } = await getArtist(objJson);
            resultFilter.push({ userName: userNameArtists, ethAddressFollowings: element });
          }
        }),
      );

      return resultFilter;
    }
    return resultFilter;
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
"FilterOptionFollowerArtist" and it takes two parameters: "userNameSearch" and "artist". */
Parse.Cloud.define('FilterOptionFollowerArtist', async (request) => {
  const { userNameSearch, artist } = request.params;
  const resultFilter: any = [];

  try {
    if (userNameSearch) {
      const query = new Parse.Query('Followers');
      query.equalTo('ethAddress', artist);

      const follower = await query.first({ useMasterKey: true });
      const followernew = follower?.get('followings');

      await Promise.all(
        followernew.map(async (element: any) => {
          if (userNameSearch.length > 0) {
            if (element.userName.search(userNameSearch) === 0) {
              resultFilter.push(element);
            }
          }
        }),
      );
      return resultFilter;
    }
    return resultFilter;
  } catch (error) {
    return error;
  }
});

/* The above code is a cloud function written in TypeScript for the Parse server. It defines a function
called 'ToGoFilterOptionFollowerArtist' that takes in two parameters: 'ethAddressUser' and
'userNameFollowers'. */
Parse.Cloud.define('ToGoFilterOptionFollowerArtist', async (request) => {
  const { ethAddressUser, userNameFollowers } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getCountFollowers(ownerAddress: any, userNameUser: any) {
    const query = new Parse.Query('Followers');

    query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);

    const count = await query.count({ useMasterKey: true });

    return count;
  }

  try {
    const query = new Parse.Query('Followers');
    query.equalTo('ethAddress', ethAddressUser);
    const follower = await query.find({ useMasterKey: true });
    if (follower) {
      const { username, userAvatar } = await getUser(ethAddressUser);

      const theFollower = await getCountFollowers(ethAddressUser, userNameFollowers);

      const newArray: any = [{ theFollower, username, userAvatar, ethAddressUser }];

      return newArray;
    }
    return false;
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud Function called 'reviewLikes'. This function takes in two
parameters: 'token' and 'collectionAddress'. */
Parse.Cloud.define('reviewLikes', async (request) => {
  const { token, collectionAddress } = request.params;
  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    if (currentUser && token && collectionAddress) {
      const schema = await Parse.Schema.all();
      const likesClass = schema.find((s) => s.className === 'LikesNfts');
      if (!likesClass) {
        return false;
      }
      const likes = Parse.Object.extend('LikesNfts');

      const query = new Parse.Query(likes);
      const regex = /^[0-9]*$/;
      if (regex.test(token)) {
        query.equalTo('tokenId', token.toString());
      } else {
        query.equalTo('tokenIdAdmin', token.toString());
      }

      query.containedIn('likesUsers', [ethAddress]);

      const count = await query.count({ useMasterKey: true });

      return count;
    }
    return 0;
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud Function called 'LikesAdd'. This function takes in two
parameters: 'token' and 'collectionAddress'. */
Parse.Cloud.define('LikesAdd', async (request) => {
  const { token, collectionAddress } = request.params;

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    if (currentUser && token && collectionAddress) {
      const likes = Parse.Object.extend('LikesNfts');
      const query = new Parse.Query(likes);
      const regex = /^[0-9]*$/;
      if (regex.test(token)) {
        query.equalTo('tokenId', token.toString());
      } else {
        query.equalTo('tokenIdAdmin', token.toString());
      }
      const resultLikes = await query.first();
      if (resultLikes) {
        resultLikes.addUnique('likesUsers', ethAddress);
        await resultLikes.save();
        return 'save likes';
      }
    }
    return 'Error adding likes';
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud function called 'DoNotLikes'. This function takes in two
parameters: 'token' and 'collectionAddress'. */
Parse.Cloud.define('DoNotLikes', async (request) => {
  const { token, collectionAddress } = request.params;

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    if (currentUser && token !== null && token !== undefined && collectionAddress) {
      const likes = Parse.Object.extend('LikesNfts');
      const query = new Parse.Query(likes);
      const regex = /^[0-9]*$/;
      if (regex.test(token)) {
        query.equalTo('tokenId', token.toString());
      } else {
        query.equalTo('tokenIdAdmin', token.toString());
      }
      query.containedIn('likesUsers', [ethAddress]);
      const resultLikes = await query.first();
      if (resultLikes) {
        resultLikes.remove('likesUsers', ethAddress);
        await resultLikes.save();
        return 'save likes';
      }
    }
    return 'Error DoNotLikes likes';
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud Function called 'likeUserState'. This function takes in two
parameters: 'token' and 'collectionAddress'. */
Parse.Cloud.define('likeUserState', async (request) => {
  const { token, collectionAddress } = request.params;

  try {
    const currentUser = request.user;
    const ethAddress = currentUser?.get('ethAddress');
    if (currentUser && token && collectionAddress) {
      const query = new Parse.Query('LikesNfts');
      const regex = /^[0-9]*$/;
      if (regex.test(token)) {
        query.equalTo('tokenId', token.toString());
      } else {
        query.equalTo('tokenIdAdmin', token.toString());
      }
      query.containedIn('likesUsers', [ethAddress]);
      const result = await query.first({ useMasterKey: true });

      if (result) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    return error;
  }
});

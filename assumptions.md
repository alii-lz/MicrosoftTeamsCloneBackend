The maximum number of users will not exceed the maximum limit of positive integers. uId is therefore assumed to never exceed the maximum acceptable integer. 

Everyone has their own dataStore, therefore we developed the functions to be compatible with everyone's dataStore.

Promoting a member to a global owner will not be implemented in Iteration 1, but some functions are test for global owners. Therefore, the first user will be assumed to be global owner.

Assumptions for channelMessagesV1
Since there are no way to create messages, the following assumptions were made:
- If no messages exist and the array is undefined, the function will return an empty array instead. 




ASSUMPTION FOR INPUT IN CHANNEL.TS.
assume user only inputs valid types. i.e. doesnt input string for prefix id.


LINK TO VIDEO: https://flip.com/s/WLBzq4RtPdET

LINK TO FRONTEND FORK: https://gitlab.cse.unsw.edu.au/z5387428/project-frontend-ali
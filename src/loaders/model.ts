import DataLoader = require("dataloader");
import { MemberTypeEntity } from "../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../utils/DB/entities/DBProfiles";
import { UserEntity } from "../utils/DB/entities/DBUsers";

export type LoadersType = {
  usersLoader: DataLoader<string, UserEntity, string>;
  userSubscribedToLoader: DataLoader<string, UserEntity[], string>;
  memberTypesLoader: DataLoader<string, MemberTypeEntity, string>;
  profilesLoader: DataLoader<string, ProfileEntity, string>;
  postsLoader: DataLoader<string, PostEntity, string>;
}
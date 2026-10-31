import { z } from "astro/zod";
import type { BackgroundWallpaperConfig } from "../types/backgroundWallpaper";
import appearance from "../data/appearance.json";
import music from "../data/music.json";
import profile from "../data/profile.json";

// CMS 删除可选图片时可能写入 null。统一空值，旧配置继续作为回退。
const image = z.preprocess((v) => v ?? "", z.string());
const images = z.preprocess((v) => v ?? [], z.array(z.string()));

export const cmsProfile: {
	avatar: string;
	name?: string;
	bio?: string | null;
	signature?: string | null;
} = z
	.object({
		avatar: image,
		name: z.string().optional(),
		bio: z.string().nullish(),
		signature: z.string().nullish(),
	})
	.parse(profile);

export const cmsAppearance: {
	banner: string;
	desktop: string[];
	mobile: string[];
	mode?: BackgroundWallpaperConfig["mode"];
	dimOpacity?: number;
	blur?: number;
	cardOpacity?: number;
	carousel?: boolean;
	backgroundVideoEnabled?: boolean;
} = z
	.object({
		banner: image,
		desktop: images,
		mobile: images,
		mode: z.enum(["banner", "fullscreen", "overlay", "none"]).optional(),
		dimOpacity: z.number().min(0).max(1).optional(),
		blur: z.number().min(0).max(30).optional(),
		cardOpacity: z.number().min(0).max(1).optional(),
		carousel: z.boolean().optional(),
		backgroundVideoEnabled: z.boolean().optional(),
	})
	.parse(appearance);

export const cmsMusic: {
	enabled: boolean;
	volume: number;
	playlist?: {
		name: string;
		artist?: string | null;
		url: string;
		cover: string;
	}[];
} = z
	.object({
		enabled: z.boolean().default(true),
		volume: z.number().min(0).max(1).default(0.7),
		playlist: z
			.array(
				z.object({
					name: z.string().min(1),
					artist: z.string().nullish(),
					url: z.string().min(1),
					cover: image,
				}),
			)
			.nullish()
			.transform((value) => (value === null ? [] : value)),
	})
	.parse(music);

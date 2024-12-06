import { z } from "zod";

export const PageSchema =
z.object ({
title: z.string(),
contents: z.string(), 
}) ;
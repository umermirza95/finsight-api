import {checkSchema, Meta} from "express-validator";
import ERROR_MESSAGES from "../utils/error-messages";
import {FSCategoryType} from "../interface/FSCategory";
import {getCategoryById, getCategoryByName, getSubCategoryById} from "../services/category-services";

export const createCategoryValidator = checkSchema({
  name: {
    exists: {
      errorMessage: ERROR_MESSAGES["category_name"],
    },
    isString: true,
    escape: true,
    custom: {
      options: uniqueCategoryNameValidator,
    },
  },
  type: {
    isIn: {
      options: [[FSCategoryType.expense, FSCategoryType.income]],
      errorMessage: ERROR_MESSAGES["invalid_category_type"],
    },
    escape: true,
  },
})

async function uniqueCategoryNameValidator(value: string, meta: Meta) {
  try {
    const category = await getCategoryByName(value, meta.req.body.user.uid)
    if (category) {
      throw Error("Category name is not unique")
    }
  } catch (error: any) {
    throw Error(error)
  }
}

export async function categoryIdValidator(value: string, meta: Meta) {
  try {
    const category = await getCategoryById(value, meta.req.body.user.uid)
    if (!category) {
      throw Error(ERROR_MESSAGES["invalid_category_id"])
    }
  } catch (error: any) {
    throw Error(error)
  }
}

export async function subcategoryIdValidator(value: string, meta: Meta) {
  try {
    const subcategory = await getSubCategoryById(value, meta.req.body.user.uid)
    if (!subcategory) {
      throw Error(ERROR_MESSAGES["invalid_subcategory_id"])
    }
  } catch (error: any) {
    throw Error(error)
  }
}

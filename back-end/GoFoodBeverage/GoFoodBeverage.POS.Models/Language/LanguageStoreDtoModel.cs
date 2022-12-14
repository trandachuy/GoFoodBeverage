using System;
using GoFoodBeverage.POS.Models.Common;

namespace GoFoodBeverage.POS.Models.Language
{
    public class LanguageStoreDtoModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }

        public string Emoji { get; set; }

        public StatusModel IsPublish { get; set; }

        public bool IsDefault { get; set; }

    }
}

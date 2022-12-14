using System;
using System.Collections.Generic;

namespace ZH_VBII48.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string? FullName { get; set; }

    public string? Avatar { get; set; }

    public string? Email { get; set; }

    public string? Country { get; set; }

    public string? Address { get; set; }

    public DateTime? Date { get; set; }

    public string? Creditcard { get; set; }

    public string? Amount { get; set; }
}

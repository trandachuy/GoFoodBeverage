﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GoFoodBeverage.Application.Providers.Email {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class EmailTemplate {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal EmailTemplate() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("GoFoodBeverage.Application.Providers.Email.EmailTemplate", typeof(EmailTemplate).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to &lt;div style=&quot;text-align:center;font-family: &apos;Plus Jakarta Sans&apos;;letter-spacing:0.3px;&quot;&gt;
        ///    &lt;div style=&quot;font-size:40px;font-weight:800;line-height:50px;color:#50429B;&quot;&gt;Welcome to {0}&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:28px;font-weight:700;line-height:35px;color:#000;&quot;&gt;Dear {1}&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:60px;font-weight:800;line-height:76px;text-transform:uppercase;margin-top:80px;color:#50429B;&quot;&gt;Congratulation !&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:32px;font-weight:400;margin-top:53px;text-align:center;col [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string REGISTER_NEW_STORE_ACCOUNT {
            get {
                return ResourceManager.GetString("REGISTER_NEW_STORE_ACCOUNT", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to &lt;div style=&quot;text-align:center;font-family: &apos;Plus Jakarta Sans&apos;;letter-spacing:0.3px;&quot;&gt;
        ///    &lt;div style=&quot;font-size:40px;font-weight:800;line-height:50px;color:#50429B;&quot;&gt;Chúc mừng bạn đến với {0}&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:28px;font-weight:700;line-height:35px;color:#000;&quot;&gt;Chào {1}&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:60px;font-weight:800;line-height:76px;text-transform:uppercase;margin-top:80px;color:#50429B;&quot;&gt;Chúc mừng!&lt;/div&gt;
        ///    &lt;div style=&quot;font-size:32px;font-weight:400;margin-top:53px;text-align:cente [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string REGISTER_NEW_STORE_ACCOUNT_VI {
            get {
                return ResourceManager.GetString("REGISTER_NEW_STORE_ACCOUNT_VI", resourceCulture);
            }
        }
    }
}